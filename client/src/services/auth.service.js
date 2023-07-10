import api from '@/_plugins/axios'

const jwt = require('jsonwebtoken');

class AuthService {
    login(user) {
        return api.post('api/login', {
            username: user.username,
            password: user.password
        })
        .then(response => {
            const token = response.headers['authorization'].replace("Bearer ", "");
            if (token) {
                localStorage.setItem("jwt-token", token);
            }
        })
    }

    logout() {
        localStorage.removeItem('jwt-token');
    }

    getUser() {
        const token = jwt.decode(localStorage.getItem('jwt-token'));
        return (token ? token.user : null);
    }
}

export default new AuthService();
