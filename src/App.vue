<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <Search></Search>
    </div>
    <router-view/>
  </div>
</template>

<script>
import Search from "./components/Search"
export default {
  components: {
    Search
  }
}
</script>

<style lang="scss" src="./main.scss">
// lägg in stilar i /src/styles/styles.scss
//skapar ni en ny scss fil. glöm inte importera i /main.scss
</style>
