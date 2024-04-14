#!/bin/bash
# wait-for-mongodb.sh

set -e

host="$1"
shift
cmd="$@"

nc -z -w 15 $host 27017

>&2 echo "MongoDB is up - executing command"
exec $cmd
