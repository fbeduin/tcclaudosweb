const { connect } = require('../_helpers/mongodb');
const { updatesForPatch } = require('../_helpers/mongodb-patch');

exports.getEspecialidades = async () => {
    const db = await connect();
    const projection = {
        'data': 0, 
        '_id': 0
      };
    const result = await db.collection("col_template").find({}, { projection }).toArray();
    return result;
}

exports.getPorEspecialidade = async (especialidade) => {
    const db = await connect();
    const result = await db.collection("col_template").findOne({"especialidade": especialidade});
    return result;
}

exports.applyPatch = async (especialidade, patches) => {
    const db = await connect();
    const original = await db.collection("col_template").findOne({"especialidade": especialidade});
    const updates = updatesForPatch(patches, original);

    for await (const update of updates) {
        await db.collection("col_template").updateOne({"especialidade": especialidade}, update);
    }    
};