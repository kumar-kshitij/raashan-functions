const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });
const utils = require('./utils');

admin.initializeApp();

const isPlainObject = require('lodash/fp/isPlainObject');

exports.createAdmin = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        let params = utils.getParamsFromRequest(req);

        if(!(typeof params.email === 'string' && params.email.length > 0)) {
            return res.status(200).json({
                success: false,
                message: 'Invalid email'
            });
        }
        if(!(typeof params.password === 'string' && params.password.length > 0)) {
            return res.status(200).json({
                success: false,
                message: 'Invalid password'
            });
        }
        if(!(typeof params.name === 'string' && params.name.length > 0)) {
            return res.status(200).json({
                success: false,
                message: 'Invalid name'
            });
        }
        if(!(isPlainObject(params.roles) && params.roles !== null)) {
            return res.status(200).json({
                success: false,
                message: 'Invalid roles'
            });
        }

        try {
            let userRecord = await admin.auth()
                .createUser({
                    email: params.email,
                    password: params.password
                });

            await admin
                .firestore()
                .collection('admins')
                .doc(userRecord.uid)
                .set({
                    name: params.name,
                    email: userRecord.email,
                    roles: params.roles
                });

            return res.status(200).json({
                success: true,
                message: 'Admin created successfully'
            });
        } catch(error) {
            return res.status(200).json({
                success: false,
                message: error.message
            });
        }
    });
});

exports.deleteAdmin = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        let params = utils.getParamsFromRequest(req);

        if(!(typeof params.uid === 'string' && params.uid.length > 0)) {
            return res.status(200).json({
                success: false,
                message: 'Invalid uid'
            });
        }

        try {
            await admin.auth().deleteUser(params.uid);
            
            await admin
                .firestore()
                .collection('admins')
                .doc(userRecord.uid)
                .delete();
            
            return res.status(200).json({
                success: true,
                message: 'Admin deleted successfully'
            });
        } catch(error) {
            return res.status(200).json({
                success: false,
                message: error.message
            });
        }
    });
});