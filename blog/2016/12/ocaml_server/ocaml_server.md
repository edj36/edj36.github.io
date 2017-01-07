---  
title: Ocaml Server 
author: Eric Johnson  
date: December 16, 2016 
---  

## OCaml Client/Server
* * *

Recently in a project for school, my team and I decided to build a server to
complement a game we had been working on. The [course](http://www.cs.cornell.edu/courses/cs3110/2016fa/index.php) is about functional programming and
is taught in OCaml, thus we needed to use Ocaml to implement the client and server we wanted for our game.
I certainly struggled at first finding useful examples or documentation for my needs, so here I am going to
try and make my own. (These examples are built off of what I found in the
documentation for `cohttp`).

## Setup
* * *

First, install Ocaml. [Here](http://www.cs.cornell.edu/courses/cs3110/2016fa/install.html)
is how I did it.

Next, we need to install a couple of libraries, specifically `cohttp` and `lwt`.
Those are the libaries we are going to use for networking (`cohttp`) and for
threading (`lwt`). Get them from `opam` like this:
``` 
$ opam install cohttp lwt
```
`cohttp` is a popular OCaml HTTP library, and `lwt` (Light Weight
Threading) is exactly that, a light-weight thread library for Ocaml.

## Client
* * *

For my purposes, I needed my client to be able to send `GET` and `POST` requests. This is a bit
tricky at first, but usually pretty simple once you have a general form for your requests.

You can dig through the [cohttp](http://github.com/mirage/ocaml-cohttp/) repository to find their implementation of different requests,
and to learn what you need to supply to send the requests. The repo also has a few useful
examples, which I built upon for my purposes.

First we need to open the libraries we are using:
``` {.ocaml .numberLines}
open Lwt
open Cohttp
open Cohttp_lwt_unix
```

The `GET` request:
``` {.ocaml .numberLines}
let get_request =
  let u = Uri.of_string "host-name" in
  Client.get u >>= fun (resp, body) ->
    let code = resp |> Response.status |> Code.code_of_status in
    Printf.printf "Response code: %d\n" code;
    body |> Cohttp_lwt_body.to_string >|= fun body ->
      Printf.printf "Body of length: %d\n" (String.length body);
      body
```

and the `POST` request:
``` {.ocaml .numberLines}
let post_request str =
  let b = Cohttp_lwt_body.of_string str in
  let u = Uri.of_string "host-name" in
  Client.post ~body: b u >>= fun (resp, body) ->
    let code = resp |> Response.status |> Code.code_of_status in
    Printf.printf "Response code: %d\n" code;
    body |> Cohttp_lwt_body.to_string >|= fun body ->
      Printf.printf "Body of length: %d\n" (String.length body);
      body
```
Now to send either request:
``` {.ocaml .numberLines}
(* sends GET request *)
Lwt.run get_request
(* sends POST request with given [str] as body *)
Lwt.run (post_request str)
```
For a while, I was lost as to why my request code seemed to compile fine,
but nothing was ever sent. Calling `Lwt.run` is what actually triggers
the functions execution, as it is asynchronous and needs to be scheduled.

## Server
* * *
Now for some backend stuff. It is pretty simple to get a server up and
running, and I will show you the basics of that here. Above, in the client example,
I was a bit vague and just gave some implementations of functions to send requests.
Here, for the server, the code should run fine without any tweaks, however,
I would still be sure to modify it to suit your needs.

``` {.ocaml .numberLines}
open Lwt
open Cohttp
open Cohttp_lwt_unix

let server =
let callback _conn req body =
  let uri = req |> Request.uri |> Uri.to_string in
  let meth = req |> Request.meth |> Code.string_of_method in
  match req |> Request.meth with
  | `GET -> body |> Cohttp_lwt_body.to_string >|= (fun body ->
      (print_endline "GET REQUEST RECEIVED");
      body)
    >>= (fun body -> (Server.respond_string ~status:`OK ~body ()))
  | `POST -> body |> Cohttp_lwt_body.to_string >|= (fun body ->
      (print_endline "POST REQUEST RECEIVED");
      body)
    >>= (fun body -> (Server.respond_string ~status:`OK ~body ()))
  | _ -> body |> Cohttp_lwt_body.to_string >|= (fun body ->
      (print_endline "UNEXPECTED REQUEST RECEIVED");
      ("ERROR"))
    >>= (fun body -> (Server.respond_string ~status:`OK ~body ()))
in
Server.create ~mode:(`TCP (`Port 8080)) (Server.make ~callback ())

let () = ignore (Lwt_main.run server)
```

This code will create and run a server on `localhost:8080`, and the server
can be "killed" with `CTRL C`. As you can see, its just a simple echo server,
but it serves as a good starting point to building something more complex and exciting.


## Usage
***

Once you have client and server implemented, its useful to develop a simple
way to run them. I made a Makefile so that I would be able to run
simple commands like `make server` in my terminal to compile and run the code.
Makefile is as follows:
``` {.numberLines}
client:
ocamlbuild -pkg cohttp.lwt client_example.native && ./client_example.native

server:
ocamlbuild -pkg cohttp.lwt server_example.native && ./server_example.native

clean:
ocamlbuild -clean
```
If you plan on using a Makefile, be sure to change `client_example` and
`server_example` to whatever you named your client and server files. Also,
it is important to remember that the code snippets above aren't going to do much
(if anything at all) if just copied and pasted into a `.ml` file and left to
run. I will leave it up to you to build code around them for your client and
server to actually do something useful :).

If anything above is wrong or unclear, or even if you just really like my work,
let me know on [twitter](http://twitter.com/EJ96)!!
