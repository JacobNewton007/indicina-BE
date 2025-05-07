# indicina-test

### 1. Clone the Repository

```bash
git clone 
cd indicina
```

### 2. Install Packages

Run the following command to install the required dependencies:

```bash
npm install
```

### 3. Ensure Ubuntu is Running

If you are using Windows or Mac, you can set up Ubuntu using the following steps:

#### On Windows:

1. Install [Windows Subsystem for Linux (WSL)](https://learn.microsoft.com/en-us/windows/wsl/install).
2. Open a terminal and run:
   ```bash
   wsl
   ```

#### On Mac:

1. Install a virtualization tool like [Multipass](https://multipass.run/).
2. Start an Ubuntu instance:
   ```bash
   multipass launch --name ubuntu-lts
   multipass shell ubuntu-lts
   ```

### 4. Install Redis

#### On Ubuntu:

```bash
sudo apt update
sudo apt install redis-server
sudo systemctl enable redis
sudo systemctl start redis
```

#### On Mac:

1. Install Homebrew if not already installed:
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```
2. Install Redis:
   ```bash
   brew install redis
   brew services start redis
   ```

#### On Windows:

1. Install Redis using [Chocolatey](https://chocolatey.org/) or [Redis for Windows](https://github.com/tporadowski/redis/releases).
2. Using Chocolatey:
   ```bash
   choco install redis-64
   redis-server
   ```

### 5. Verify Redis Installation

Run the following command to check if Redis is running:

```bash
redis-cli ping
```

You should see the response: `PONG`.

### 6. Start the Server

Run the following command to start the server:

```bash
npm run dev
```

### 7. Run the test cases

Run the following command to run the tests:

```bash
 npm run test
```
