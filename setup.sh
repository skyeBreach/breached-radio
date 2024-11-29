#!/usr/bin/env bash

## Notes To Add To Knowledge Base
## "-gt" means greater than
## "shift [n]" removes n positional command line parameters from the start 

# TODO 
## Basic Flag Parser
## --Help flag
## Bun commands
    ## Install
    ## Link
## Run JS scripts

#----------------------------------------------------------------------------------------------------------------------#
# Command-Line Flags

CYAN='\033[1;36m'
NO_COLOR='\033[0m'

## Function to display the commands usage flags
usage() {
    echo "Usage: $0 [OPTIONS]"
    echo "Options:"
    echo " -h, --help      Display this help message"
    echo " -v, --verbose   Enable verbose mode"
    echo " -d, --dry-run   Run this command without performing any actions"
}

## Store boolean variables for the command line flags
args=
bFlagsActive=false
bDryRun=false
bSilent=false

## Iterate through all positional args
while [ $# -gt 0 ]; do
    case $1 in
        -h | --help)
            usage
            exit 1
            ;;
        -d | --dry-run)
            bFlagsActive=true
            bDryRun=true
            ;;
        -s | --silent)
            bFlagsActive=true
            bVerbose=false
            bSilent=true
            ;;
    esac
    shift
done

if [ "$bSilent" == true ]; then 
    args="${args} --silent"
fi  

if [ "$bDryRun" == true ]; then
    args="${args} --dry-run"
fi


#----------------------------------------------------------------------------------------------------------------------#
# Command Information

if [ "$bSilent" == false ]; then
    echo -e "${CYAN}Running Setup${NO_COLOR}"
    echo
fi

#------------------------- ---------------------------------------------------------------------------------------------#
# Platform/OS Checking

## Store if this script is being run on Mac/Linux or Windows, as there are different commands for these
bWindows=false
if [ "$OSTYPE" == "msys" ]; then
    bWindows=true
fi

#----------------------------------------------------------------------------------------------------------------------#
# Bun Runtime Setup

## Install Bun if its not already installed
if ! command -v bun --version 2>&1 >/dev/null; then
    if [ "$bSilent" == false ]; then 
        echo -e "${CYAN}Installing Bun Runtime:${NO_COLOR}"
    fi

    ## Install bun based on the Platform we are on
    if [ "$bDryRun" == false ]; then
        if [ "$bWindows" == "0" ]; then
            curl -fsSL https://bun.sh/install | bash
        elif [ "$bWindows" == "1" ]; then
            powershell -c "irm bun.sh/install.ps1|iex";
        fi
    fi
fi  

#----------------------------------------------------------------------------------------------------------------------#
# Package Installation

if [ "$bSilent" == false ]; then 
    echo -e "${CYAN}Installing all node packages:${NO_COLOR}"
fi

bun install ${args}

if [ "$bSilent" == false ]; then 
    echo
fi

#----------------------------------------------------------------------------------------------------------------------#
# Run Setup Typescript Script

bun run ./scripts/setup.ts $args

#----------------------------------------------------------------------------------------------------------------------#
