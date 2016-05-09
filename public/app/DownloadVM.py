import re
import urllib2
import pycurl
import pdb

url = "http://geo.azmag.gov/"
path = "maps/demographic/app/vm/"
pattern = '<A HREF="/%s.*?">(.*?)</A>' % path
print("path is {0}".format(url+path))
print("pattern is {0}".format(pattern))

pdb.set_trace()
response = urllib2.urlopen(url+path).read()

for filename in re.findall(pattern, response):
    fp = open(filename, "wb")
    curl = pycurl.Curl()
    curl.setopt(pycurl.URL, url+path+filename)
    curl.setopt(pycurl.WRITEDATA, fp)
    curl.perform()
    curl.close()
    fp.close()
