# Job Hiring App - Team Yellow Card

Job Hiring app that matches jobs listed by employers to users who are looking for jobs. 

## Setting up Dev Environment (Mac and Windows) 
Sorry linux users you're on your own

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


## Installation

Install virtualenv:
```
pip3 install virtualenv
```

Create a new virtual environment (make sure you are in the right directory) :
```
virtualenv venv
```
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
```
python3 manage.py makemigrations
python3 manage.py migrate
```
Start the REST api:
```
python3 manage.py runserver
```
Now install the node packages:
```
npm install
```
now enter the react-frontend directory with ```cd react-frontend``` and enter the following command:
```
npm install
npm start
```

