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
      .input('Username', db.VarChar, request.body.username)
      .query("SELECT * FROM [User] WHERE Username = @username")
    user = user.recordset[0];
    if(user!=undefined)
    {
        response.status(403); 
        response.json({ message:"Username already exists" });
    }
    else
    response.status(200)
  })
  // authentication: perform login
  app.post("/api/login", async (request, response) => {
    let user = await db.pool
      .request()
      .input("Username", db.VarChar, request.body.username)
      .query("SELECT * FROM [User] WHERE Username = @Username");
    user = user.recordset[0];
    if (user && user.Username && (await bcrypt.compare(request.body.password, user.Password))) {
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
        .query("SELECT * FROM [User] WHERE username = @username AND password = @password", [request.session.user.Username, request.session.user.Password]);
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
      .query("SELECT * FROM [Playlist] WHERE PlaylistName LIKE '%' + @searchString + '%'");
    data = data.recordset;
    response.json(data);
  });

   // search for new notifications
   app.get("/api/notification/:userId", async (request, response) => {
    let data = await db.pool
      .request()
      .input("userId", db.Int, request.params.userId)
      .query("SELECT * FROM [Notification] WHERE UserId = @userId AND Unread = 1");
    data = data.recordset;
    response.json(data);
  });

  //get userId from a username for notification sending
  app.get("/api/notification/:userName", async (request, response) => {
    let data = await db.pool
      .request()
      .input("userName", db.NVarChar, request.params.userName)
      .query("SELECT UserId FROM [User] WHERE UserName = @userName");
    data = data.recordset;
    response.json(data);
  });

 

  // send notifications
  app.post("/api/notification", async (request, response) => {
    let data = await db.pool
      .request()
      .input("userId", db.Int, request.body.userId)
      .input("senderName", db.NVarChar, request.body.senderName)
      .input("unread", db.Int, request.body.unread)
      .input("sharedContentId", db.NVarChar, request.body.sharedContentId)
      .input("sharedContentType", db.NVarChar, request.body.sharedContentType)
      .input("sharedContentName", db.NVarChar, request.body.sharedContentName)
      .query("INSERT INTO [Notification] VALUES (@userId, @senderName, @unread, @sharedContentId, @sharedContentType, @sharedContentName)");
    response.json(data);
  });

  // update notification-unread to false
  app.put("/api/notification/", async (request, response) => {
    // check if user exists before writing
    if (!request.session.user) {
      response.status(403); // forbidden
      response.json({ error: "not logged in" });
      return;
    }
    let result = await db.pool
      .request()
      .input("id", db.Int, request.body.Id)
      .input("UserId", db.Int, request.body.UserId)
      .input("SenderName", db.NVarChar, request.body.SenderName)
      .input("SharedContentId", db.NVarChar, request.body.SharedContentId)
      .input("SharedContentType", db.NVarChar, request.body.SharedContentType)
      .input("SharedContentName", db.NVarChar, request.body.SharedContentName)
      .query("UPDATE [Notification] SET UserId = @UserId, SenderName = @SenderName, Unread = 0, SharedContentId = @SharedContentId, SharedContentType = @SharedContentType, SharedContentName = @SharedContentName WHERE Id = @id");
    response.json(result);
  });

  // ******************************** OBS!!!! ALL BELOW ARE Example routes ****************************************

  //public get playlists with userId
  app.get("/api/getplaylist", async (request, response) => {
    let data = await db.pool
      .request()
      .input("id", db.Int, request.session.user.UserId)
      .query("SELECT [UserPlaylist].[PlaylistId], [Playlist].[PlaylistName], [Playlist].[OwnerId] FROM [UserPlaylist] left join [Playlist] on [UserPlaylist].[PlaylistId] = [Playlist].[PlaylistId] where UserId = @id");
    response.json(data.recordset);
  });

 // unfollow/delete from userplaylist
 app.delete("/api/deletePlaylist/:playlistId", async (request, response) => {
    let result = await db.pool
      .request()
      .input("playlistId", db.Int, request.params.playlistId)
      .query("DELETE FROM [UserPlaylist] WHERE PlaylistId = @playlistId");
    response.json(result);

    let result2 = await db.pool
      .request()
      .input("playlistId", db.Int, request.params.playlistId)
      .query("DELETE FROM [Playlist] WHERE PlaylistId = @playlistId");
    response.json(result2);
  });

  // delete from userplaylist with userid and playlistid
  app.delete("/api/unfollowpPlaylist/:playlistId", async (request, response) => {
    let result = await db.pool
      .request()
      .input("id", db.Int, request.session.user.UserId)
      .input("playlistId", db.Int, request.params.playlistId)
      .query("DELETE FROM [UserPlaylist] WHERE PlaylistId = @playlistId AND UserId = @id");
    response.json(result);
  });

//get musicplaylist 
app.get("/api/getMusicPlaylist/:playlistId", async (request, response) => {
  let data = await db.pool.request()
  .input('playlistId', db.Int, request.params.playlistId)
  .query('SELECT [Music].*, [MusicPlaylist].[PlaylistId], [Playlist].[PlaylistName] FROM [MusicPlaylist] join [Music] on [MusicPlaylist].[SongId] = [Music].[SongId] join [Playlist] on [MusicPlaylist].[PlaylistId] = [Playlist].[PlaylistId] where Playlist.PlaylistId = @playlistId')
  response.json(data.recordset)
})

//Post Music 
app.post("/api/music", async (request, response) => {

  await db.pool.request()
  .input('Artist', db.NVarChar, request.body.artist.name)
  .input('Title', db.NVarChar, request.body.name)
  .input('AlbumName', db.NVarChar, request.body.album.name)
  .input('Duration', db.Int, request.body.duration)
  .input('videoId', db.NVarChar, request.body.videoId)
  .input('contentType', db.NVarChar, request.body.type)
  .query("IF NOT EXISTS ( SELECT 1 FROM [Music] WHERE videoId = @videoId) BEGIN INSERT INTO [Music] VALUES (@Artist,@Title,@AlbumName,@Duration,@videoId,@contentType) END")

   response.json();
   
})
//Post MusicPlaylist
app.post("/api/musicplaylist/", async (request, response) => {
    
    await db.pool.request()
      .input('videoId', db.NVarChar, request.body.videoId)
      .input('playlistId', db.Int, request.body.id)
      .query(`declare @myVal int; SET @myVal = (SELECT SongId FROM [Music] WHERE videoId = @videoId)  INSERT INTO [MusicPlaylist](SongId,PlaylistId) VALUES (@myVal,@playlistId)`)
      response.json()

}),
 
  // private create new playlist 
  app.post("/api/newPlaylist", async (request, response) => {
    // check if user exists before writing
    if (!request.session.user) {
      response.status(403); // forbidden
      response.json({ error: "not logged in" });
      return;
    }
    let data = await db.pool.request()
    .input('PlaylistName', db.VarChar, request.body.PlaylistName)
    .input('Shared', db.VarChar, false)
    .input('OwnerId', db.VarChar, request.session.user.UserId)
    .input('ReadOnly', db.VarChar, false)
    .query(`INSERT INTO [Playlist](PlaylistName,Shared,OwnerId,ReadOnly) OUTPUT Inserted.PlaylistId VALUES (@playlistname,@shared,@ownerid,@readonly) declare @myVal int; SET @myVal = (SELECT IDENT_CURRENT ('Playlist')) INSERT INTO [UserPlaylist](UserId,PlaylistId) VALUES (@OwnerId,@myVal)`)
    response.json(data.recordset[0])
  })


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
      .query("UPDATE [TABLE] SET name = @name, slogan = @slogan, updated = @updated, color = @color WHERE id = @id");
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
