import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/settings',
        name: 'About',
        component: () => import('../views/Settings.vue')
    },
    {
        path:'/scripts/edit/:id',
        name: 'EditScript',
        component: () => import('../views/EditScript.vue')
    },
    {
        path:'/scripts/variables/:id',
        name: 'Variables',
        component: () => import('../views/Variables.vue')
    },
    {
        path:'/scripts/run/:id',
        name: 'RunScript',
        component: () => import('../views/RunScript.vue')
    },
    {
        path:'/test',
        name: 'test',
        component: () => import('../views/test.vue')
    }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

export default router
