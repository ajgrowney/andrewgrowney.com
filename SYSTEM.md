# System Design


## Defined Interactions
### Resource Types
- Projects
- Blogs

### Users and Views
- If the user goes to a `/{resource}` page
    - Display means of navigating all available items in that resource type AND a summary of them
    -  **Need a template for displaying summaries of a resource group to fulfill this requirement**
        - SummaryView.js
        - SummaryHeader.js

- If the user goes to a `/{resource}/{id}` page
    - Display a visual reprentation of that item 
    - **Need a template for displaying this resource type in order to fulfill this requirement**
        - ResourceView.js
        - ResourceHeader.js

