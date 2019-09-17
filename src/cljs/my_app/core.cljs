(ns my-app.core
  (:require
   [reagent.core :as reagent]
   [re-frame.core :as re-frame]
   [my-app.events :as events]
   [my-app.views :as views]
   [my-app.config :as config]
   [my-app.routes :refer [app-routes]]
   ))


(defn dev-setup []
  (when config/debug?
    (println "dev mode")))

(defn ^:dev/after-load mount-root []
  (re-frame/clear-subscription-cache!)
  (reagent/render [views/main-panel]
                  (.getElementById js/document "app")))

(defn init []
  (re-frame/dispatch-sync [::events/initialize-db])
  (app-routes)
  (dev-setup)
  (mount-root))
