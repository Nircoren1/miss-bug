import { showErrorMsg,showSuccessMsg } from "../../js/services/eventBus-service.js"
import { userService } from "../services/user.service.js"

export default {
    template:`
    <section class="login-signup">
        <h3>Login/Signup</h3>
        <button v-if="loggedinUser" @click="logout">logout</button>
        <form  @submit.prevent="login">
            <h2>Login</h2>
            <input type="text" v-model="credentials.username" placeholder="Username" />
            <input type="password" v-model="credentials.password" placeholder="Password" />
            <button>Login</button>
        </form>
        <hr />
        <form  @submit.prevent="signup">
            <h2>Signup</h2>
            <input type="text" v-model="signupInfo.fullname" placeholder="Full name" />
            <input type="text" v-model="signupInfo.username" placeholder="Username" />
            <input type="password" v-model="signupInfo.password" placeholder="Password" />
            <button>Signup</button>
        </form>
    </section>
    `,
     data() {
        return {
            credentials: {
                username: 'puki',
                password: '123'
            },
            signupInfo: {
                fullname: '',
                username: '',
                password: ''
            },
            loggedinUser:null,
        }
    },created() {
        this.loggedinUser = userService.getLoggedInUser()
    },
    methods: {
        logout(){
            userService.logout()
            this.loggedinUser = null
        },
        login() {
            userService.login(this.credentials)
                .then(user => {
                    this.loggedinUser = user
                    showSuccessMsg(`login success ${user.fullname}`)
                    this.$emit('onChangeLoginStatus')
                })
                .catch(err => {
                    console.log('Cannot login', err)
                    showErrorMsg(`Cannot login`)
                })
        },
        signup() {
            userService.signup(this.signupInfo)
                .then(user => {
                    this.$emit('onChangeLoginStatus')
                })
                .catch(err => {
                    console.log('Cannot signup', err)
                    showErrorMsg(`Cannot signup`)
                })
        },
    }

}

