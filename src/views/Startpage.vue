<template>
  <div class="formHolder">

     <form  v-show='toggle' @submit.prevent="checkForm" >
      <p v-if="errors.length">
         <b>Please correct the following error(s):</b>
           <ul>
              <li v-for="(error,index) in errors" v-bind:key="index">{{ error }}</li>
          </ul>
      </p>
      <h2>Login </h2>
      <label>Username</label>
      <input v-model="user.username"/>
      <label>Password</label>
      <input type="password" v-model="user.password"/>
      <div>
        <input class="submit" value="Register" type="submit" @click='toggle = !toggle'>
        <input class="submit"  value="Log in" type="submit" @click="loginUser">
      </div>
    </form>

    <form v-show='!toggle' @submit.prevent="checkForm">
     <p v-if="errors.length">
       <b>Please correct the following error(s):</b>
         <ul> 
            <li v-for="(error,index) in errors" v-bind:key="index">{{ error }}</li>
        </ul>
      </p>
      <h2>Register user</h2>
      <label>Username</label>
      <input id="username" v-model="user.username"/>
      <label>Password</label>
      <input id="password" type="password" v-model="user.password"/>
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
        errors:[],
        user:{},
        confirmPassword:String,
        toggle: true,
              
    };
  },
methods: {
  checkForm: function(e){
    if(this.user.username && this.user.password)
    {
      return true;
    }
    this.errors = [];

    if(!this.user.username){
      this.errors.push('Username required');
    }
    if(!this.user.password) {
      this.errors.push('Password required');
    }
    e.preventDefault();
  },
    loginUser(){
       this.$store.commit("updateUser",this.user);
       this.$store.dispatch("loginUser")     
       },

    validateUsername() {
        if(this.user.password!=this.confirmPassword)
        {           
          this.errors.push('The passwords doesn´t match, try again');
        }
        else
        {
            this.$store.commit("updateUser",this.user); 
            this.$store.dispatch("validateUsername")      
        }      
    },

}
}

</script>

<style scoped>
.submit {
  width:45%;
}
form div {
  margin-top:10px
}
.formHolder {
  display:flex;
  align-items: center;
  justify-content: center;
  height:100%;
}
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
