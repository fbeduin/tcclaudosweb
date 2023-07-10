const { connect } = require('../_helpers/mongodb');

exports.listAll = async () => {
    try {
        const db = await connect();
        const result = await db.collection("col_usuarios").find({ ic_tipo: 'M' }).toArray();
        return result;
    } catch(e) {
        
    }
};

exports.create = async (novoUsuario) => {
    try {
        const db = await connect();
        await db.collection("col_usuarios").insert(novoUsuario);
    } catch(e) {

    }
};

exports.update = async (usuario) => {
    const db = await connect();
    return await db.collection("col_usuarios").updateOne({"co_crm": usuario.co_crm}, usuario);
};