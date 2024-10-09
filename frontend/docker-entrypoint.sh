#!/bin/sh
set -e

sed -i 's|${REACT_APP_BACKEND_URL}|'$REACT_APP_BACKEND_URL'|g' /usr/share/nginx/html/static/js/*.js

exec "$@"