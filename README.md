# Yellow Careers

Job Hiring app that matches jobs listed by employers to users who are looking for jobs. 

## Setting up Dev Environment (Mac and Windows) 

### For mac:

Install Homebrew
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Install python
```bash
brew install python
```
Install node:
```
brew install node
```

Check your installations with:
```
python3 --version
```
```
node -v
npm -v
```

### For Windows:

You will need Winget (it comes with windows but if you don't have it for some reason get it from [here](https://winget.run/))

Install Python:
```
winget install -e --id Python.Python.3.11
```
Install node:
```
winget install -e --id OpenJS.NodeJS.LTS
```
Check your installations with:
```
python --version
```
```
node -v
npm -v
```


## Setting up and running the app

First enter the frontend directory with ```cd frontend``` (from the root directory) and enter the following commands:

Install the node packages:
```
npm install
```

Run the app in development mode:
```
npm start
```

Now, enter the backend directory with ```cd backend``` (from the root directory) and enter the following commands:

Install virtualenv:
```
pip3 install virtualenv
```

Create a new virtual environment:
```
virtualenv venv
```

Activate the virtual environment:
(Mac)
```
source venv/bin/activate 
```
(Windows)
```
venv/Scripts/activate
```

Install all the dependencies:
```bash
pip3 install -r requirements.txt
```

Make migrations and migrate:
```
python3 manage.py makemigrations
python3 manage.py migrate
```

Start the REST api:
```
python3 manage.py runserver
```
