#!/bin/bash
export $(cat .env | xargs)
yarn start