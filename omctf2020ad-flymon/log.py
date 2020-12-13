
from datetime import datetime


def desc(info):
    with open('temp/'+info, 'a') as file:
        file.write('\n')
        file.write('cookie')
        file.write('\n')


#{2020-05-10 12:13:21 +000} WARN user hacker31337 tried to access nonexisting logs for job 432424234
def logger(a,b,c,d,e):
    now = datetime.now()
    log = str(now)+a+b+c+d+e
    print(log)
    with open('/var/log/flymon.log', 'a') as file:
        file.write(log)
        file.write('\n')

x=' Info'
y=' user'
c=' alex'
z=' Registered'
f=' Complete'

logger(x,y,c,z,f)
