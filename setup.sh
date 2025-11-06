#!/bin/bash

# Colors
C_RESET='\033[0m'
C_RED='\033[0;31m'
C_GREEN='\033[0;32m'
C_YELLOW='\033[0;33m'
C_BLUE='\033[0;34m'
C_MAGENTA='\033[0;35m'
C_CYAN='\033[0;36m'

# Header
echo -e "${C_CYAN}"
echo "  ***************************************************"
echo "  *                                                 *"
echo "  *        Welcome to the Project Setup Script        *"
echo "  *                                                 *"
echo "  ***************************************************"
echo -e "${C_RESET}"

# --- Node.js and npm Installation ---
echo -e "\n${C_YELLOW}Step 1: Checking for Node.js and npm...${C_RESET}"

# Check for nvm
export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  echo -e "${C_GREEN}nvm is already installed.${C_RESET}"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
else
  echo -e "${C_YELLOW}nvm not found. Installing nvm...${C_RESET}"
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
  echo -e "${C_GREEN}nvm installed successfully.${C_RESET}"
fi


# Check for Node.js and install if not present
if ! command -v node &> /dev/null; then
  echo -e "${C_YELLOW}Node.js not found. Installing the latest LTS version...${C_RESET}"
  nvm install --lts
  nvm use --lts
  echo -e "${C_GREEN}Node.js and npm installed successfully.${C_RESET}"
else
  echo -e "${C_GREEN}Node.js is already installed.${C_RESET}"
fi

echo -e "${C_BLUE}Node version: $(node -v)${C_RESET}"
echo -e "${C_BLUE}npm version: $(npm -v)${C_RESET}"


# --- npm install ---
echo -e "\n${C_YELLOW}Step 2: Installing project dependencies...${C_RESET}"
if npm install; then
  echo -e "${C_GREEN}Dependencies installed successfully!${C_RESET}"
else
  echo -e "${C_RED}An error occurred during npm install. Please check the output above.${C_RESET}"
  exit 1
fi


# --- Prompt to run dev server ---
echo -e "\n${C_YELLOW}Step 3: Start the development server?${C_RESET}"
while true; do
  read -p "Do you want to run 'npm run dev'? (y/n): " yn
  case $yn in
    [Yy]* )
      echo -e "${C_GREEN}Starting the development server...${C_RESET}"
      npm run dev
      break
      ;;
    [Nn]* )
      echo -e "${C_MAGENTA}Setup complete! You can start the server later by running 'npm run dev'.${C_RESET}"
      exit
      ;;
    * ) echo "Please answer yes or no.";;
  esac
done

echo -e "\n${C_CYAN}***************************************************${C_RESET}"
echo -e "${C_CYAN}*              Setup Finished!                  *${C_RESET}"
echo -e "${C_CYAN}***************************************************${C_RESET}
