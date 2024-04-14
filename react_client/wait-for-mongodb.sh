#!/bin/sh

# wait-for-mongodb.sh

set -e

host="$1"
shift
cmd="$@"

until mongo --host $host --eval "quit();" &> /dev/null; do
  >&2 echo "El servicio $host no está disponible todavía. Esperando..."
  sleep 1
done

>&2 echo "El servicio $host está disponible. Continuando con la ejecución de '$cmd'"
exec $cmd
