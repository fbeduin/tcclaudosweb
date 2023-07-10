const roles = {
    Admin: 'Administrador',
    Medico: 'Médico'
};

module.exports = roles;

module.exports.getRole = (user) => {
    switch (user.ic_tipo){
        case 'A':
            return roles.Admin;
        case 'M':
            return roles.Medico;
    }
}