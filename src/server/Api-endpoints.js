const bcrypt = require("bcrypt");


module.exports = (app, db) => {

  // Authentication routes

  // register user
  app.post('/api/users', async (request, response) => {

    let password = await bcrypt.hash(request.body.password, 10);
    let result = await db.pool.request()
      .input('Username', db.VarChar, request.body.username)
      .input('Password', db.VarChar, password)
      .query("INSERT INTO [User](Username,Password) VALUES (@username,@password)")
    response.json(result)
  })

  // authentication: perform login
  app.post('/api/login', async (request, response) => {
    let user = await db.pool.request()
      .input('username', db.VarChar, request.body.username)
      .query('SELECT * FROM [User] WHERE username = @username')
    user = user.recordset[0]
    if(user && user.username && await bcrypt.compare(request.body.password, user.password)){
      request.session.user = user
      user.loggedIn = true
      response.json({loggedIn: true})
    }else{
      response.status(401) // unauthorized  https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
      response.json({message:"no matching user"})
    }
  })

  // authentication: get logged in user
  app.get('/api/login', async (request, response) => {
    let user
    if(request.session.user){
      user = await db.pool.request()
        .input('username', db.VarChar, request.session.user.username)
        .input('password', db.VarChar, request.session.user.password)
        .query('SELECT * FROM [User] WHERE username = @username AND password = @password', [request.session.user.username, request.session.user.password])
      user = user.recordset[0]
    }
    if(user && user.username){
      user.loggedIn = true
      delete(user.password)
      response.json(user)
    }else{
      response.status(401) // unauthorized  https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
      response.json({message:"not logged in"})
    }
  })

  // logga ut
  app.delete('/api/login', async (request, response) => {
    request.session.destroy( () => {
      response.json({loggedIn: false})
    } )
  })


  // OBS!!!! ALL BELOW ARE Example routes

  // public get one table row
  app.get("/api/examples/:id", async (request, response) => {
    let data = await db.pool.request()
      .input('id', db.Int, request.params.id)
      .query('SELECT * FROM [TABLE] WHERE id = @id')
    data = data.recordset[0] // single row
    response.json(data)
  })

  //public get playlists with userId
  app.get("/api/table/:id", async (request, response) => {
    let data = await db.pool.request()
    .input('id', db.Int, request.params.id)
    .query('SELECT * FROM [Playlist] WHERE OwnerId = id')
    response.json(data.recordset)
  })

  //alt get playlists with userId
/*  app.get("/api/userplaylist/:id", async (request, response) => {
    //check user
    if(!request.session.user){
      response.status(401) // unauthorised
      response.json({error:'not logged in'})
      return;
    }
    let data = await db.pool.request()
    .query('SELECT * FROM [UserPlaylist] WHERE UserId = ?', [request.session.user.id])
    response.json(data.recordset)
  })*/


  // public get another table (happens to be a left joined view)
  app.get("/api/examples_with_colors", async (request, response) => {
    let data = await db.pool.request().query('SELECT * FROM [TABLE]')
    response.json(data.recordset)
  })

  // private create one row
  app.post("/api/examples", async (request, response) => {
    // check if user exists before writing
    if(!request.session.user){
      response.status(403) // forbidden
      response.json({error:'not logged in'})
      return
    }
    // https://www.npmjs.com/package/mssql#data-types
    let result = await db.pool.request()
      .input('name', db.VarChar, request.body.name)
      .input('slogan', db.VarChar, request.body.slogan)
      .input('color', db.Int, request.body.color)
      .query("INSERT INTO [TABLE] (name, slogan, color) VALUES (@name, @slogan, @color)")
    response.json(result)
  })

  // private update one row
  app.put("/api/examples/:id", async (request, response) => {
    // check if user exists before writing
    if(!request.session.user){
      response.status(403) // forbidden
      response.json({error:'not logged in'})
      return
    }
    let result = await db.pool.request()
      .input('id', db.Int, request.params.id)
      .input('name', db.VarChar, request.body.name)
      .input('slogan', db.VarChar, request.body.slogan)
      .input('updated', db.DateTime, new Date())
      .input('color', db.Int, request.body.color)
      .query("UPDATE [TABLE] SET name = @name, slogan = @slogan, updated = @updated, color = @color WHERE id = @id")
    response.json(result)
  })

  // private delete one row
  app.delete("/api/examples/:id", async (request, response) => {
    // check if user exists before writing
    if(!request.session.user){
      response.status(403) // forbidden
      response.json({error:'not logged in'})
      return
    }
    let result = await db.pool.request()
      .input('id', db.Int, request.params.id)
      .query("DELETE FROM [TABLE] WHERE id = @id")
    response.json(result)
  })


}