import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


def send_email():
    fromaddr = "raymond.spaces@gmail.com"
    toaddr = "mzc2fd@virginia.edu"
    msg = MIMEMultipart()
    msg['From'] = fromaddr
    msg['To'] = toaddr
    msg['Subject'] = "London Trip Possibilities Overview"

    body = "Here is your Columbus Overview for London!"
    msg.attach(MIMEText(body, 'plain'))

    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login(fromaddr, "starthack2017")
    text = msg.as_string()
    server.sendmail(fromaddr, toaddr, text)
    server.quit()
