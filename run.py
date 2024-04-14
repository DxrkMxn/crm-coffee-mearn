import subprocess
import time
import os

def run_command(command, cwd):
    return subprocess.Popen(command, shell=True, cwd=cwd)

def run_backend(backend_command, backend_path):
    while True:
        try:
            backend_process = run_command(backend_command, cwd=backend_path)
            backend_process.wait()
        except Exception as e:
            print(f"Error al ejecutar el backend: {e}")
        finally:
            time.sleep(5)

if __name__ == "__main__":
    backend_path = "./backend"
    backend_command = "node index.js"

    react_path = "./react_client"
    react_command = "npm run start"

    angular_path = "./angular_client"
    angular_command = "ng serve"

    try:
        backend_process = run_command(backend_command, cwd=backend_path)
        backend_pid = backend_process.pid
        print(f"Backend iniciado en segundo plano con PID: {backend_pid}")

        run_command(react_command, cwd=react_path)
        print("Cliente React.JS iniciado en segundo plano.")

        run_command(angular_command, cwd=angular_path)
        print("Cliente Angular.JS iniciado en segundo plano.")

        backend_process.wait()
    except Exception as e:
        print(f"Error al ejecutar el backend: {e}")
    finally:
        os.kill(backend_pid, 9)
