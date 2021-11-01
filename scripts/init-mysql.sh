#!/bin/sh

echo "Start schema migration"

# if [ -z "$HASURA_GRAPHQL_ADMIN_SECRET" ]; then
#     show_error "HASURA_GRAPHQL_ADMIN_SECRET is not set"
#     exit 3
# else
#     echo "HASURA_GRAPHQL_ADMIN_SECRET:"
#     echo $HASURA_GRAPHQL_ADMIN_SECRET
# fi

echo "Importing mysql database"
docker exec -i gtrack_mysql_1 mysql -uroot -pmysql gtrack < ./mysql/gtrack.sql
# hasura migrate apply --endpoint http://localhost:8080 --database-name default
# hasura metadata apply --endpoint http://localhost:8080
# hasura metadata reload --endpoint http://localhost:8080
# echo "Verifying migration status"
# hasura migrate status --database-name default
echo "Moving back to root project directory"
cd ..
