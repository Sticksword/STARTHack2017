import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText



fromaddr = "raymond.spaces@gmail.com"
toaddr = "mzc2fd@virginia.edu"
msg = MIMEMultipart()
msg['From'] = fromaddr
msg['To'] = toaddr
msg['Subject'] = "SUBJECT OF THE MAIL"

body = "YOUR MESSAGE HERE"
msg.attach(MIMEText(body, 'plain'))

server = smtplib.SMTP('smtp.gmail.com', 587)
server.starttls()
server.login(fromaddr, "starthack2017")
text = msg.as_string()
server.sendmail(fromaddr, toaddr, text)
server.quit()
