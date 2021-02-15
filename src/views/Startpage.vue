<template>
  <div>
     <form  v-show='toggle' class="signInUser">
      <h3>Login </h3>
      <label>Username</label>
      <input v-model="user.username"/>
      <label>Password</label>
      <input type="password" v-model="user.password"/>
      <div>
        <input class="submit" value="Register" type="submit" @click='toggle = !toggle'>
        <input class="submit"  value="Log in" type="submit" @click="loginUser">
      </div>
    </form>

    <form v-show='!toggle' class="registerUser">
      <h3>Register user</h3>
      <label>Username</label>
      <input v-model="user.username"/>
      <label>Password</label>
      <input type="password" v-model="user.password"/>
      <label>Confirm password</label>
      <input v-model="confirmPassword" type="password" />
      <div>
        <input class="submit" value="Cancel" type="submit" @click='toggle = !toggle'>
        <input class="submit"  value="Create account" type="submit" @click="createUser">
      </div>
    </form>
  </div>
</template>

<script>


export default {
name: 'Startpage',
data(){
    return{
        user:{},
        toggle: true,
              
    };
  },
methods: {
    loginUser(){
      alert("logga in")
       this.$store.commit("updateUser",this.user); //updates user in store
       this.$store.dispatch("loginUser")
       
       },

    createUser() {
        if(this.user.password==this.confirmPassword)
        {           
            this.$store.commit("updateUser",this.user); //updates user in store
            this.$store.dispatch("createUser")                
        }      
    },
    validateUsername(){
        //TODO: Check if username is already taken  
    }
}
}

</script>

<style scoped>

input {
  border-radius: 5px;
  width: 250px;
  height: 30px;
}
form {
  display: flex;
  flex-direction: column;
}
</style>
