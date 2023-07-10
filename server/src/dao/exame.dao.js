const { connect } = require('../_helpers/mongodb');

exports.getExamePorMedico = async (user) => {
    try {
        const db = await connect();
        const agg = [
            {
                '$lookup': {
                    'from': 'col_laudos', 
                    'localField': 'id_exame', 
                    'foreignField': 'id_exame', 
                    'as': 'o_laudo'
                }
            }, 
            {
                '$match': {
                    'o_medico_exame.crm': user,
                    'o_laudo': []
                }
            }
        ];
        
        const result = await db.collection("col_exames").aggregate(agg);
        return result.toArray();
    } catch(e) {
        return e;
    }
}

exports.getExamePorId = async (id) => {
    try {
        const db = await connect();
        const result = await db.collection("col_exames").findOne({ "id_exame": id });
        return result;
    } catch(e) {
        return e;
    }
}

exports.saveExamesExternos = async (dados) => {
    try {
        const db = await connect();
        await db.collection("col_exames").insertMany(dados);
    } catch(e) {
        return e;
    }
}