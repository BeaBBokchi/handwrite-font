import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Use a service account
cred = credentials.Certificate('authentication/key.json')
firebase_admin.initialize_app(cred, {
  'projectId': 'handwrite-font',
})

db = firestore.client()

def serverUpload(uid, time, url) :
    doc_ref = db.collection(u'Fonts').document(uid).collection(u'Uploads').document(time)
    doc_ref.set({
        u'isDone': True
    }, merge=True)
