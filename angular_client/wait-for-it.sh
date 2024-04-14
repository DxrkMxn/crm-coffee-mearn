#!/bin/bash
# wait-for-it.sh
# Wait for a service to be available before continuing.

set -e

host="$1"
port="$2"
shift 2
cmd="$@"

until nc -z "$host" "$port"; do
    >&2 echo "El servicio $host:$port no está disponible todavía. Esperando..."
    sleep 1
done

>&2 echo "El servicio $host:$port está disponible. Continuando con la ejecución de '$cmd'"
exec $cmd
