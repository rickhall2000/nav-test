(ns my-app.routes
  (:require [secretary.core :as secretary :refer-macros [defroute]]
            [reagent.core :as reagent]
            [my-app.views :as views]))

(defn app-routes
  []
  (defroute "/page-1" {:as params}
            (reagent/render [views/page-one]
                            (.getElementById js/document "app")))
  (defroute "/page-2" {:as params}
            (reagent/render [views/page-two]
                            (.getElementById js/document "app"))))


