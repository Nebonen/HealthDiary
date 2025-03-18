# Test documentation

For testing I use Robot Framework

## Installing Robot Framework and libraries

### 1. Virtual enviroment

Create .venv folder

```bash
python -m venv .venv
```

Activate the virtual enviroment

- Windows

```bash
.venv\Scripts\activate
```

- macOS

```bash
source .venv/bin/activate
```

Add .venv folder to .gitignore.

### 2. Install Robot Framework

Install Robot Framework

```bash
pip install robotframework
```

Install Browser library

```bash
pip install robotframework-browser
```

Initialize the library

```bash
rfbrowser init
```

Install Requests library

```bash
pip install robotframework-requests
```

Install Crypto library

```bash
pip install --upgrade robotframework-crypto
```

Install Robotidy

```bash
pip install robotframework-tidy
```

### 3. Create `requirements.txt`

```bash
pip freeze > requirements.txt
```

This generates the `requirements.txt` which includes the list from `pip freeze`

### 4. Test the installation

I tested the installation using [asennustesti.py](asennustesti.py)

![Installation](../images/Installation.png)
