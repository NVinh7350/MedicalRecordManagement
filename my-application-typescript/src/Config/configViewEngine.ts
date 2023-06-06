import express, { Express } from "express";
import bodyparser from "body-parser"
const configViewEngine = (app: Express) => {
    app.use(express.static('./src/public'))
    app.use(bodyparser.json())
    app.use(bodyparser.urlencoded({ extended: true }))
    app.set("view engine", "ejs")
    app.set("views", "./src/views")
}

export default configViewEngine;