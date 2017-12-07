import AddUser from './components/AddUser.vue'
import Home from './components/Home.vue'
import AddStudent from './components/AddStudent.vue'

export default [
    { path: '/', component: Home, name: 'home' },
    { path: '/addUser', component: AddUser, name: 'addUser' },
    { path: '/addStudent', component: AddStudent, name: 'addStudent' },
]