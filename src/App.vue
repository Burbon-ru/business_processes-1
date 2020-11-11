<template>
    <div id="app">
        <div id="nav">
            <router-link to="/">Home</router-link> |
            <router-link to="/settings">Settings</router-link>
        </div>
        <router-view/>
    </div>
</template>

<style lang="scss">
    #app {
        max-width: 1024px;
        margin: 0 auto;
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }

    #nav {
        padding: 30px;

        a {
            font-weight: bold;
            color: #2c3e50;

            &.router-link-exact-active {
                color: #42b983;
            }
        }
    }

    .edit_question {
        outline: 1px solid red;
        position: fixed;
        right: 0;
        width: 300px;
        height: 100%;
        padding: 20px;
        top: 0;
        z-index: 999;
        background: #fff;
    }

    .modal-mask {
        position: fixed;
        z-index: 9998;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .5);
        display: table;
        transition: opacity .3s ease;
    }

    .modal-wrapper {
        display: table-cell;
        vertical-align: middle;
    }

    canvas {
        background-color: #FFFFFF;
        position: absolute;
        z-index: -10;
    }

    @import '../node_modules/bootstrap/dist/css/bootstrap.css';
</style>
