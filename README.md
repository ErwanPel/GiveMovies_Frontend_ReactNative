
<h2 align="center">

<img
		width="250"
		alt="GiveMovies picture of randomMovies Screen"
		src="https://github.com/ErwanPel/GiveMovies_Frontend_ReactNative/blob/main/assets/img/giveMovies_Random.png">
</h2>
<h1 align="center">
Project GiveMovies - Frontend
</h1>

<p align="center">
	<img alt="Last Commit" src="https://img.shields.io/github/last-commit/ErwanPel/GiveMovies_Frontend_ReactNative.svg?style=flat-square">
	<img alt="Licence" src="https://img.shields.io/github/license/ErwanPel/GiveMovies_Frontend_ReactNative.svg?style=flat-square">
	<img alt="Star" src="https://img.shields.io/badge/you%20like%20%3F-STAR%20ME-blue.svg?style=flat-square">
</p>

## Tech Stack

**Client:** TypeScript, React Native, NativeWind.css

[**Server:**](https://github.com/ErwanPel/GiveMovies_Backend_ReactNative) TypeScript, Node.js, Express.js, MongoDB

## Overview

This is my first personal full-stack project using TypeScript. I wanted to create a mobile application to consult a list of films, allowing users to post and consult reviews with a like/dislike system and the possibility for each user to manage his or her profile. I also set up a "Random Movies" mode to help the user to choose a movie if inspiration fails. For using the application, it's necessary to be logged in. 
</br>

This client-side Give Movies project uses 9 screens :

1) Signin: displays a registration form.
2) Login: displays a login form.
3) ReviewsWall: displays all reviews in a publishing wall in chronological order.
4) ReviewsUser: displays all user posts (review box in purple) or other user posts (review box in white).
5) Movies: displays a list of movies. Ability to navigate between pages.
6) Movie: displays the information of a movie and all its reviews. If the user has already created a review on a movie, he will not be able to recreate a new one on the same movie, but he will have the possibility to update or delete it.
7) RandomMovies: out of inspiration? by pressing the button, the application randomly chooses a movie for you!
8) Profile: displays the user profile. Ability to change email address, update/delete his photo, log out or permanently delete his account. 
</br>


</br>
This project uses the Movies API of bootcamp "Le Reacteur" and requires an API key to obtain the movies.
In development, TypeScript is used to check variables, and the Zod package dynamically checks the input/output of promises.
For access to the photo gallery or camera, the user’s permission is requested above all. If the user refuses, an alert explains how to change permissions. For all deletion actions, an alert is systematically launched to warn the user of the consequence of the action.


## Screenshots

<div align="center">
  <p>Signin Screen</p>
<img
		width="230"
		alt="Signin Screen"
		src="https://github.com/ErwanPel/GiveMovies_Frontend_ReactNative/blob/main/assets/img/giveMovies_signIn.png">
    <p>Login Screen</p>
<img	
    width="230"
		alt="ReviewsWall Screen"
		src="https://github.com/ErwanPel/GiveMovies_Frontend_ReactNative/blob/main/assets/img/giveMovies_ReviewWall.png">
    <p>ReviewUser Screen (wall of the user connected)</p>
<img
			width="230"
		alt="ReviewUser Screen"
		src="https://github.com/ErwanPel/GiveMovies_Frontend_ReactNative/blob/main/assets/img/giveMovies_myreview.png">
      <p>ReviewUser Screen (wall of an other user)</p>
<img
			width="230"
		alt="ReviewUser Screen"
		src="https://github.com/ErwanPel/GiveMovies_Frontend_ReactNative/blob/main/assets/img/giveMovies_reviewUser.png">
  <p>Movies Screen</p>
<img
			width="230"
		alt="Movies Screen"
		src="https://github.com/ErwanPel/GiveMovies_Frontend_ReactNative/blob/main/assets/img/giveMovies_Movies.png">
   <p>Movie Screen (movie information poster) </p>
<img
		width="230"
		alt="Movie Screen"
		src="https://github.com/ErwanPel/GiveMovies_Frontend_ReactNative/blob/main/assets/img/giveMovies_movie_picture.png">
     <p>Movie Screen (movie reviews section) </p>
  <img
		width="230"
		alt="Profile Screen"
		src="https://github.com/ErwanPel/GiveMovies_Frontend_ReactNative/blob/main/assets/img/giveMovies_movie_review.png">
  <p>Random Movie Screen</p>
  <img
		width="230"
		alt="RandomMovies Screen"
		src="https://github.com/ErwanPel/GiveMovies_Frontend_ReactNative/blob/main/assets/img/giveMovies_Random.png">
  <p>Profile Screen</p>
  <img
		width="230"
		alt="Profile Screen"
		src="https://github.com/ErwanPel/GiveMovies_Frontend_ReactNative/blob/main/assets/img/giveMovies_profile.png">
</div>

  
## Installation and usage

Be sure, you have installed all dependencies and applications to run React Native project on your computer : [Getting Started with React Native](https://facebook.github.io/react-native/docs/getting-started).

This project works for iOS and Android. For the iOS version, I note that some styles must be debugged but this does not prevent the application from being functional. I need to see if it should have with accessory components or with NativeWind.


### Running the project

Clone this repository :

```
git clone https://github.com/ErwanPel/GiveMovies_Frontend_ReactNative.git
cd GiveMovies_Frontend_ReactNative
```

Install packages :

```
yarn

```

When installation is complete, you have to launch  :

```
yarn start

```

Once the expo server is running, you can use the QR-Code with your phone (the phone needs the application Expo for android [Expo](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=fr&gl=US) or for IOS [Expo Go](https://apps.apple.com/fr/app/expo-go/id982107779). 
Also, you can use a simulator which is [Android Studio](https://developer.android.com/studio) for android or for IOS [xCode](https://apps.apple.com/fr/app/xcode/id497799835?mt=12).


You can see the server side for this Project GiveMovies [here](https://github.com/ErwanPel/GiveMovies_Backend_ReactNative).

## Star, Fork, Clone & Contribute

Feel free to contribute on this repository. If my work helps you, please give me back with a star. This means a lot to me and keeps me going!
