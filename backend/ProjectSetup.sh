# makemigrations の実行
python manage.py makemigrations axes
python manage.py makemigrations access_security
python manage.py makemigrations accounts
python manage.py makemigrations vrmchat
python manage.py makemigrations

# migrate の実行
python manage.py migrate axes
python manage.py migrate access_security
python manage.py migrate accounts
python manage.py migrate vrmchat
python manage.py migrate

# createsuperuser の実行
python manage.py createsuperuser

# gcloud config set project <--YOUR PROJECT_ID-->
# gcloud auth application-default login