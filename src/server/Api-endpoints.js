const bcrypt = require("bcrypt");

module.exports = (app, db) => {
  // Authentication routes

  // register user
  app.post("/api/users", async (request, response) => {
    let password = await bcrypt.hash(request.body.password, 10);
    let result = await db.pool.request()
      .input('Username', db.VarChar, request.body.username)
      .input('Password', db.VarChar, password)
      .query("INSERT INTO [User](Username,Password) VALUES (@username,@password)")
    response.json(result)
  }),
  //Check if username already exists
  app.post("/api/checkUser",async (request,response) => {
    let user = await db.pool.request()
      .input("Username", db.VarChar, request.body.username)
      .query("SELECT * FROM [User] WHERE Username = @Username")
    user = user.recordset[0];
    if(user!=undefined)
    {
        response.status(403); 
        response.json({ message:"Username already exists" });
    }
    else
    response.status(200)
    response.json({ message:"User dont exist" });
  })
  // authentication: perform login
  app.post("/api/login", async (request, response) => {
    let user = await db.pool
      .request()
      .input("Username", db.VarChar, request.body.username)
      .query("SELECT * FROM [User] WHERE Username = @Username");
    user = user.recordset[0];
    if (
      user &&
      user.Username &&
      (await bcrypt.compare(request.body.password, user.Password))
    ) {
      request.session.user = user;
      user.loggedIn = true;
      response.json({ loggedIn: true });
    } else {
      response.status(401); // unauthorized  https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
      response.json({ message: "no matching user" });
    }
  });

  // authentication: get logged in user
  app.get("/api/login", async (request, response) => {
    let user;
    if (request.session.user) {
      user = await db.pool
        .request()
        .input("username", db.VarChar, request.session.user.Username)
        .input("password", db.VarChar, request.session.user.Password)
        .query(
          "SELECT * FROM [User] WHERE username = @username AND password = @password",
          [request.session.user.Username, request.session.user.Password]
        );
      user = user.recordset[0];
    }
    if (user && user.Username) {
      user.loggedIn = true;
      delete user.Password;
      response.json(user);
    } else {
      response.status(401); // unauthorized  https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
      response.json({ message: "not logged in" });
    }
  });

  // logga ut
  app.delete("/api/login", async (request, response) => {
    request.session.destroy(() => {
      response.json({ loggedIn: false });
    });
  });

  // search for playlists
  app.get("/api/playlist/:searchString", async (request, response) => {
    let data = await db.pool
      .request()
      .input("searchString", db.NVarChar(db.MAX), request.params.searchString)
      .query(
        "SELECT * FROM [Playlist] WHERE PlaylistName LIKE '%' + @searchString + '%'"
      );
    data = data.recordset;
    response.json(data)
  })

  // search for new notifications
  app.get('/api/notification/:userId', async (request, response) => {
    let data = await db.pool.request()
      .input('userId', db.Int, request.params.userId)
      .query("SELECT * FROM [Notification] WHERE UserId = @userId AND Unread = 1")
    data = data.recordset;
    response.json(data)
  });

  // send notifications
  app.post("/api/notification", async (request, response) => {
    let data = await db.pool
      .request()
      .input("userId", db.Int, request.body.userId)
      .input("senderName", db.NVarChar, request.body.senderName)
      .input("unread", db.Int, request.body.unread)
      .input("url", db.NVarChar, request.body.url)
      .input("contentType", db.NVarChar, request.body.contentType)
      .input("playlistId", db.NVarChar, request.body.playlistId)
      .query(
        "INSERT INTO [Notification] VALUES (@userId, @senderName, @unread, @url, @contentType, @playlistId)"
      );
    data = data.recordset;
    console.log(data);
    response.json(data);
  });

  // ******************************** OBS!!!! ALL BELOW ARE Example routes ****************************************

  // public get one table row
  app.get("/api/examples/:id", async (request, response) => {
    let data = await db.pool
      .request()
      .input("id", db.Int, request.params.id)
      .query("SELECT * FROM [TABLE] WHERE id = @id");
    data = data.recordset[0]; // single row
    response.json(data);
  });

  //public get playlists with userId
  app.get("/api/getplaylist", async (request, response) => {
    let data = await db.pool.request()
    .input('id', db.Int, request.session.user.UserId)
    .query('SELECT [UserPlaylist].[PlaylistId], [Playlist].[PlaylistName] FROM [UserPlaylist] left join [Playlist] on [UserPlaylist].[PlaylistId] = [Playlist].[PlaylistId] where OwnerId = @id')
    response.json(data.recordset)
  })

 // unfollow/delete from userplaylist
 app.delete("/api/deletePlaylist/:playlistId", async (request, response) => {
  // check if user exists before writing
  /*if(!request.session.user){
    response.status(403) // forbidden
    response.json({error:'not logged in'})
    return
  }*/
  let result = await db.pool.request()
    //.input('id', db.Int, request.params.id)
    .input('playlistId', db.Int, request.params.playlistId)
    .query("DELETE FROM [UserPlaylist] WHERE PlaylistId = @playlistId")
  response.json(result)

  let result2 = await db.pool.request()
    .input('playlistId', db.Int, request.params.playlistId)
    .query("DELETE FROM [Playlist] WHERE PlaylistId = @playlistId")
  response.json(result2)

})

 // delete from userplaylist with userid and playlistid
 app.delete("/api/unfollowpPlaylist/:playlistId", async (request, response) => {
  // check if user exists before writing
  /*if(!request.session.user){
    response.status(403) // forbidden
    response.json({error:'not logged in'})
    return
  }*/
  let result = await db.pool.request()
    .input('id', db.Int, request.session.user.UserId)
    .input('playlistId', db.Int, request.params.playlistId)
    .query("DELETE FROM [UserPlaylist] WHERE PlaylistId = @playlistId AND UserId = @id")
  response.json(result)
})

//get musicplaylist 
app.get("/api/getMusicPlaylist/:playlistId", async (request, response) => {
  let data = await db.pool.request()
  .input('playlistId', db.Int, request.params.playlistId)
  //.query('SELECT * FROM [MusicPlaylist] join [Music] on [MusicPlaylist].[SongId] = [Music].[SongId] join [Playlist] on [MusicPlaylist].[PlaylistId] = [Playlist].[PlaylistId] where [Playlist].[PlaylistId] = @playlistId')
  .query('SELECT [Music].*, [MusicPlaylist].[PlaylistId], [Playlist].[PlaylistName] FROM [MusicPlaylist] join [Music] on [MusicPlaylist].[SongId] = [Music].[SongId] join [Playlist] on [MusicPlaylist].[PlaylistId] = [Playlist].[PlaylistId] where Playlist.PlaylistId = @playlistId')
  response.json(data.recordset)
})

  // public get another table (happens to be a left joined view)
  app.get("/api/examples_with_colors", async (request, response) => {
    let data = await db.pool.request().query("SELECT * FROM [TABLE]");
    response.json(data.recordset);
  });

  // private create one row
  app.post("/api/examples", async (request, response) => {
    // check if user exists before writing
    if (!request.session.user) {
      response.status(403); // forbidden
      response.json({ error: "not logged in" });
      return;
    }
    // https://www.npmjs.com/package/mssql#data-types
    let result = await db.pool
      .request()
      .input("name", db.VarChar, request.body.name)
      .input("slogan", db.VarChar, request.body.slogan)
      .input("color", db.Int, request.body.color)
      .query(
        "INSERT INTO [TABLE] (name, slogan, color) VALUES (@name, @slogan, @color)"
      );
    response.json(result);
  });

  // private update one row
  app.put("/api/examples/:id", async (request, response) => {
    // check if user exists before writing
    if (!request.session.user) {
      response.status(403); // forbidden
      response.json({ error: "not logged in" });
      return;
    }
    let result = await db.pool
      .request()
      .input("id", db.Int, request.params.id)
      .input("name", db.VarChar, request.body.name)
      .input("slogan", db.VarChar, request.body.slogan)
      .input("updated", db.DateTime, new Date())
      .input("color", db.Int, request.body.color)
      .query(
        "UPDATE [TABLE] SET name = @name, slogan = @slogan, updated = @updated, color = @color WHERE id = @id"
      );
    response.json(result);
  });

  // private delete one row
  app.delete("/api/examples/:id", async (request, response) => {
    // check if user exists before writing
    if (!request.session.user) {
      response.status(403); // forbidden
      response.json({ error: "not logged in" });
      return;
    }
    let result = await db.pool
      .request()
      .input("id", db.Int, request.params.id)
      .query("DELETE FROM [TABLE] WHERE id = @id");
    response.json(result);
  });
};
