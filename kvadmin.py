import requests
import hidden

# Carga el token desde hidden.py
secrets = hidden.denokv()
token = secrets['token']

# Cambia esto por la URL que te dé Deno después
url = "https://healthy-shark-44.a20240195-netizen.deno.net" 

headers = {"Authorization": f"Bearer {token}"}

def check_server():
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            print("✅ Conexión exitosa con Deno!")
            print("Datos:", response.json())
        else:
            print(f"❌ Error: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"⚠️ No se pudo conectar: {e}")

if __name__ == "__main__":
    check_server()
