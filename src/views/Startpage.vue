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
        <input class="submit"  value="Create account" type="submit" @click="validateUsername">
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
        confirmPassword:String,
        toggle: true,
              
    };
  },
methods: {
    loginUser(){
       this.$store.commit("updateUser",this.user);
       this.$store.dispatch("loginUser")     
       },

    validateUsername() {
        if(this.user.password==this.confirmPassword)
        {           
            this.$store.commit("updateUser",this.user); 
            this.$store.dispatch("validateUsername")                
        }      
    },

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
