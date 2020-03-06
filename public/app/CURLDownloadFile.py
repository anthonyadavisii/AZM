import os
import sys
import pycurl
import time
import random

def downloadProgress(download_t, download_d, upload_t, upload_d):
    try:
        frac = float(download_d)/float(download_t)
    except:
        frac = 0
    sys.stdout.write("\r%s %3i%%" % ("Download:", frac*100)  )

def downloadFile(url, outputPath, pauseTimeInit=30, fileCheck=False, timeOut=28800, key_file=False, cert_file=False):
    print(urllist)
    #fileList = readFileList(fileListFile)

    # Create the fails list with blank file.
    failsFile = open(failsListFile, 'w')
    failsFile.close()

    halfPause = int(pauseTimeInit/2)
    lowPauseTime = pauseTimeInit - halfPause
    upPauseTime = pauseTimeInit + halfPause

    for file in urllist:
        fileName = file.split('/')[-1]
        print(fileName)
        downloadFile = True
        if fileCheck:
            if os.path.exists(os.path.join(outputPath, fileName)):
                downloadFile = False
            else:
                downloadFile = True

        if downloadFile:
            fp = open(os.path.join(outputPath, fileName), "wb")
            curl = pycurl.Curl()
            curl.setopt(pycurl.URL, file)
            curl.setopt(pycurl.NOPROGRESS, 0)
            curl.setopt(pycurl.PROGRESSFUNCTION, downloadProgress)
            curl.setopt(pycurl.FOLLOWLOCATION, 1)
            curl.setopt(pycurl.MAXREDIRS, 5)
            curl.setopt(pycurl.CONNECTTIMEOUT, 50)
            curl.setopt(pycurl.TIMEOUT, timeOut)
            curl.setopt(pycurl.FTP_RESPONSE_TIMEOUT, 600)
            curl.setopt(pycurl.NOSIGNAL, 1)
            curl.setopt(pycurl.WRITEDATA, fp)
            curl.setopt(pycurl.SSL_VERIFYPEER, 0)
            curl.setopt(pycurl.SSL_VERIFYHOST, 2)
            if key_file:
                curl.setopt(pycurl.SSLKEY, key_file)
            if cert_file:
                curl.setopt(pycurl.SSLCERT, cert_file)
            try:
                print("Start time: " + time.strftime("%c"))
                curl.perform()
                print("\nTotal-time: " + str(curl.getinfo(curl.TOTAL_TIME)))
                print("Download speed: %.2f bytes/second" % (curl.getinfo(curl.SPEED_DOWNLOAD)))
                print("Document size: %d bytes" % (curl.getinfo(curl.SIZE_DOWNLOAD)))
            except:
                failsFile = open(failsListFile, 'a')
                failsFile.write(file + "\n")
                failsFile.close()
                import traceback
                traceback.print_exc(file=sys.stderr)
                sys.stderr.flush()
            curl.close()
            fp.close()
            sys.stdout.flush()
            # Pause in loop - give the server time before another connection is made...
            pauseTime = random.randint(lowPauseTime, upPauseTime)
            print("Pausing for " + str(pauseTime) + " seconds.\n")
            time.sleep(pauseTime)

def downloadFiles(urllist, failsListFile, outputPath, pauseTimeInit=30, fileCheck=False, timeOut=28800, key_file=False, cert_file=False):
    print(urllist)
    #fileList = readFileList(fileListFile)

    # Create the fails list with blank file.
    failsFile = open(failsListFile, 'w')
    failsFile.close()

    halfPause = int(pauseTimeInit/2)
    lowPauseTime = pauseTimeInit - halfPause
    upPauseTime = pauseTimeInit + halfPause

    for file in urllist:
        fileName = file.split('/')[-1]
        print(fileName)
        downloadFile = True
        if fileCheck:
            if os.path.exists(os.path.join(outputPath, fileName)):
                downloadFile = False
            else:
                downloadFile = True

        if downloadFile:
            fp = open(os.path.join(outputPath, fileName), "wb")
            curl = pycurl.Curl()
            curl.setopt(pycurl.URL, file)
            curl.setopt(pycurl.NOPROGRESS, 0)
            curl.setopt(pycurl.PROGRESSFUNCTION, downloadProgress)
            curl.setopt(pycurl.FOLLOWLOCATION, 1)
            curl.setopt(pycurl.MAXREDIRS, 5)
            curl.setopt(pycurl.CONNECTTIMEOUT, 50)
            curl.setopt(pycurl.TIMEOUT, timeOut)
            curl.setopt(pycurl.FTP_RESPONSE_TIMEOUT, 600)
            curl.setopt(pycurl.NOSIGNAL, 1)
            curl.setopt(pycurl.WRITEDATA, fp)
            curl.setopt(pycurl.SSL_VERIFYPEER, 0)
            curl.setopt(pycurl.SSL_VERIFYHOST, 2)
            if key_file:
                curl.setopt(pycurl.SSLKEY, key_file)
            if cert_file:
                curl.setopt(pycurl.SSLCERT, cert_file)
            try:
                print("Start time: " + time.strftime("%c"))
                curl.perform()
                print("\nTotal-time: " + str(curl.getinfo(curl.TOTAL_TIME)))
                print("Download speed: %.2f bytes/second" % (curl.getinfo(curl.SPEED_DOWNLOAD)))
                print("Document size: %d bytes" % (curl.getinfo(curl.SIZE_DOWNLOAD)))
            except:
                failsFile = open(failsListFile, 'a')
                failsFile.write(file + "\n")
                failsFile.close()
                import traceback
                traceback.print_exc(file=sys.stderr)
                sys.stderr.flush()
            curl.close()
            fp.close()
            sys.stdout.flush()
            # Pause in loop - give the server time before another connection is made...
            pauseTime = random.randint(lowPauseTime, upPauseTime)
            print("Pausing for " + str(pauseTime) + " seconds.\n")
            time.sleep(pauseTime)