# Install Python 3.10 if not already installed
sudo pacman -Syu python310 python310-venv

# Navigate to the project directory
cd /home/nate/Dungeon/Personal/sentiment-hound-v2/apps/sentiment-analysis-service

# Create a new virtual environment with Python 3.10
python3.10 -m venv myenv310

# Activate the virtual environment
source myenv310/bin/activate

# Install the required packages
pip install -r requirements.txt