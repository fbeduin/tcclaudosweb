const { connect } = require('../_helpers/mongodb');

exports.getLaudosPorData = async (dt_laudo) => {
    try {
        const db = await connect();
        const agg = [
            {
                '$lookup': {
                    'from': 'col_exames', 
                    'localField': 'id_exame', 
                    'foreignField': 'id_exame', 
                    'as': 'o_exame'
                }
            },
            { 
                "$unwind": "$o_exame"
            }, 
            {
                '$match': {
                  '$expr': {
                    '$eq': [
                      {
                        '$dateToString': {
                          'date': '$o_exame.dt_exame', 
                          'format': '%Y-%m-%d'
                        }
                      }, 
                      dt_laudo
                    ]
                  }
                }
            },
            { '$sort': { 'o_exame.dt_exame': -1 } }
        ];
        const result = await db.collection("col_laudos").aggregate(agg);
        return result.toArray();
    } catch(e) {
        return e;
    }
}

exports.getLaudoPorId = async (id) => {
    try {
        const db = await connect();
        const agg = [
            {
                '$lookup': {
                    'from': 'col_exames', 
                    'localField': 'id_exame', 
                    'foreignField': 'id_exame', 
                    'as': 'o_exame'
                }
            }, 
            { 
                "$unwind": "$o_exame"
            }, 
            {
                '$match': {
                    'id_exame': id
                }
            },
            { $limit: 1 }
        ];
        const result = await db.collection("col_laudos").aggregate(agg);
        return result.toArray();
    } catch(e) {
        return e;
    }
}

exports.createLaudo = async (laudo) => {
    try {
        const db = await connect();
        await db.collection("col_laudos").insertOne(laudo);
    } catch(e) {
        return e;
    }
}