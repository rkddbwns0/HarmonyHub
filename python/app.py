from flask import Flask, jsonify
import requests
from bs4 import BeautifulSoup
import time
import mysql.connector

app = Flask(__name__)

def get_db_connection():
    connection = mysql.connector.connect(
        host='127.0.0.1',
        user='harmony',
        password='1234',
        database='harmonyhub'
    )
    return connection



@app.route('/genie', methods=['GET'])
def genie():    
    chart_data = []
    rank_counter = 1

    try: 
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute("TRUNCATE TABLE genie_chart")

        for i in range(1, 5):
            url = f'https://www.genie.co.kr/chart/top200?ditc=D&ymd=20241119&hh=11&rtm=Y&pg={i}'
            headers = {
                "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
            }
            response = requests.get(url, headers=headers)
            soup = BeautifulSoup(response.text, 'html.parser')
            
            table = soup.find('table', {'class': 'list-wrap'})
            titles = table.find_all('a', {'class': 'title ellipsis'})
            artists = table.find_all('a', {'class': 'artist ellipsis'})
            albums = table.find_all('a', {'class': 'albumtitle ellipsis'})
            album_images = table.find_all('img')

            for j in range(len(titles)):
                title = titles[j].text.strip()
                artist = artists[j].text.strip()
                album = albums[j].text.strip()
                album_image_url = album_images[j]['src']

                cursor.execute('''
                        INSERT INTO genie_chart (ranking, title, artist, album, album_images) VALUES (%s, %s, %s, %s, %s)
                        ''', (rank_counter, title, artist, album, album_image_url))
                rank_counter += 1
                connection.commit()   
                time.sleep(1)
    except Exception as e:
        return e    
    finally:
        cursor.close()
        connection.close()

    return jsonify(chart_data)
    
@app.route('/melon', methods=['GET'])
def melon():
    chart_data = []
    rank_counter = 1
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute("TRUNCATE TABLE melon_chart")
        

        url = 'https://www.melon.com/chart/index.htm'
        headers = {"User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'}

        response = requests.get(url, headers=headers)
        soup = BeautifulSoup(response.text, 'html.parser')

        for tr in soup.select('tr.lst50, tr.lst100'):
            title = tr.select_one('.ellipsis.rank01 a').text.strip()
            artist = tr.select_one('.ellipsis.rank02 a').text.strip()
            album = tr.select_one('.ellipsis.rank03 a').text.strip()
            album_name = tr.select_one('.image_typeAll img')['src']

            cursor.execute('''
                INSERT INTO melon_chart (ranking, title, artist, album, album_images) VALUES (%s, %s, %s, %s, %s)
            ''', (rank_counter, title, artist, album, album_name))

            rank_counter += 1

            connection.commit()
    except Exception as e:
        return e
    finally: 
        cursor.close()
        connection.close()

    return jsonify(chart_data)

@app.route('/bugs', methods=['GET'])
def bugs():
    chart_data = []
    rank_counter = 1

    try:
        connection = get_db_connection()
        cusor = connection.cursor()

        cusor.execute("TRUNCATE TABLE bugs_chart")

        url = 'https://music.bugs.co.kr/chart'
        headers = {"User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'}
        response = requests.get(url, headers=headers)
        soup = BeautifulSoup(response.text, 'html.parser')

        table = soup.find('table', {'class': 'list trackList byChart'})
        title = table.find_all('p', {'class' : 'title'})
        artist = table.find_all('p', {'class': 'artist'})
        album = table.find_all('a', {'class': 'album'})
        album_images = table.find_all('img')

        for i in range(len(title)):
            titles = title[i].text.strip()
            artists = artist[i].text.strip()
            albums = album[i].text.strip()
            album_image = album_images[i]['src']

            cusor.execute('''
                INSERT INTO bugs_chart (ranking, title, artist, album, album_images) VALUES (%s, %s, %s, %s, %s)
            ''', (rank_counter, titles, artists, albums, album_image))

            rank_counter += 1

        connection.commit()
    except Exception as e:
        return e
    finally:
        cusor.close()
        connection.close()

    return jsonify(chart_data)

if __name__ == '__main__':
    app.run(debug=True)