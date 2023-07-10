import Vue from 'vue';
import VueRouter from 'vue-router';
import NovoLaudo from '@/views/NovoLaudo.vue';
import Templates from '@/views/Templates.vue';
import Usuarios from '@/views/Usuarios.vue';
import Exames from '@/views/Exames.vue';
import Laudos from '@/views/Laudos.vue';
import LaudoPaciente from '@/views/LaudoPaciente.vue';
import Login from '@/views/Login.vue';
import store from '@/store';

const project = require('@/project.json');

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Exames,
        props: true
    },
    {
        path: '/usuario',
        name: 'Usuarios',
        component: Usuarios,
        props: true
    },
    {
        path: '/exame',
        name: 'Exames',
        component: Exames,
        props: true
    },
    {
        path: '/laudo',
        name: 'Laudos',
        component: Laudos,
        props: true
    },
    {
        path: '/laudo/:id',
        name: 'NovoLaudo',
        component: NovoLaudo,
        props: true
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/edicao/:id',
        name: 'Templates',
        component: Templates,
        props: true
    },
    {
        path: '/laudo/:id/pdf',
        name: 'LaudoPaciente',
        component: LaudoPaciente,
        props: true
    }
];

const router = new VueRouter({
    mode: 'history',
    base: project.context,
    routes
});

router.beforeEach((to, from, next) => {
    if (!store.state.auth.user && to.name !== 'Login'){
        next({
            name: 'Login',
            query: { redirect: to.fullPath }
        });
    }
    else next()
});

export default router;
