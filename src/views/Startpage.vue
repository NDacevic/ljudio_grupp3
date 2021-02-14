<template>
  <div>
    <form class="registerUser" @submit.prevent="createUser">
      <h3>Register user</h3>
      <label>Username</label>
      <input v-model="user.username"/>
      <label>Password</label>
      <input type="password" v-model="user.password"/>
      <label>Confirm password</label>
      <input v-model="confirmPassword" type="password" />
      <div>
        <button>Cancel</button>
        <button>Create account</button>
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
       
    };
  },
methods: {
    createUser() {
        if(this.user.password==this.confirmPassword)
        {
            alert(JSON.stringify(this.user));
             this.$store.dispatch("createUser", this.user);          
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
