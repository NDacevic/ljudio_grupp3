<template>
    <div>
        <div v-for="(album, index) in albumsForArtist" :key="index">
            <p>{{ album.name }}</p>
        </div>
    </div>
</template>

<script>
export default {
    computed: {
        artistName: {
            get() {
                return this.$store.getters.getSelectedArtistName;
            }
        },
        albumsForArtist: {
            get() {
                await this.$store.dispatch('fetchAlbumsForArtist', this.artistName);
                return this.$store.getters.getAlbumsForArtist;
            }
        }
    }
}
</script>

<style>

</style>