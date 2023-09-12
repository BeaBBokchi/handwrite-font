import urllib.request
from PIL import Image

def downloadImg (uid, url) :
    urllib.request.urlretrieve(url, f"upload/{uid}.png")