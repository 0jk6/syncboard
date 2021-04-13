import json
import pystray
import requests
import pyperclip
from PIL import Image
from pystray import MenuItem as item

class Syncboard:
	def __init__(self, key):
		self.key = key
		self.image = Image.open("img.jpg")
		self.menu = (item('get',lambda: self.getData()), item('update', lambda: self.updateData()), item('quit', lambda: self.quit()))
		self.icon = pystray.Icon("name", self.image, "syncboard", self.menu)
		self.icon.run()

	def getData(self):
		try:
			print("Getting data from database...", end="")
			r = requests.post("https://syncy.herokuapp.com/api/v1/getdata", data={"apikey":self.key})
			c = json.loads(r.content)
			pyperclip.copy(c['message'])
			print("[DONE!]")
		except:
			print("\nSomething went wrong...")

	def updateData(self):
		try:
			print("Updating data on database...", end="")
			clipdata = pyperclip.paste().rstrip()
			r = requests.post("https://syncy.herokuapp.com/api/v1/update", data={"apikey":self.key, "data":clipdata})
			print("[DONE!]")
		except:
			print("\nSomething went wrong...")

	def quit(self):
		self.icon.visible = False
		self.icon.stop()


f = open("key.json")
apiData = json.load(f)
f.close()
key = apiData['apikey']

run = Syncboard(key)