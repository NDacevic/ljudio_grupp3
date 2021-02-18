<template>
<div>
        <div class="imgDiv">
          <img src="../assets/Ljudio_logo_Large.png" >
      </div>
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
        <input class="submit"  value="Log in" type="submit">
      </div>
    </form>

    <form v-show='!toggle' @submit.prevent="checkFormReg">
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
        <input class="submit"  value="Create account" type="submit">
      </div>
    </form>
  </div>
</div>

</template>

<script>
export default {
name: 'Startpage',
data(){
  
    return{
        errors:[],
        user:{},
        confirmPassword:"",
        toggle: true,          
    };
  },
methods: {
  checkForm: function(e){
       
    if(this.user.username && this.user.password)
    {
      this.loginUser();
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

    checkFormReg: function(e){
      
     this.errors = [];
    if(this.user.username && this.user.password && this.confirmPassword)
    {   
      this.validateUsername();   
    }  
  
    if(!this.user.username){
      this.errors.push('Username required');
    }
    if(!this.user.password) {
      this.errors.push('Password required');
    }
    if(!this.confirmPassword) {
      this.errors.push('Confirmation password required');
    }
    e.preventDefault();
  },
   loginUser(){
       this.$store.commit("updateUser",this.user);
       this.$store.dispatch("loginUser")     
       },

  validateUsername() {
    
    if(this.user.password != this.confirmPassword)
    {
     this.errors.push('Password doesn´t match');
    }
    else{
       this.$store.commit("updateUser",this.user); 
       this.$store.dispatch("validateUsername")}   
    },
}
}

</script>

<style scoped>
.imgDiv{
  display:flex;
  justify-content:center;
  scale:80%;
}
.submit {
  width:45%;
}
form {
  display: flex;
  flex-direction: column;
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


</style>
