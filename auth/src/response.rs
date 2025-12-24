use chrono::prelude::*;
use serde::Serialize;

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct UserResponse {
    pub id: String,
    pub name: String,
    pub email: String,
    pub verified: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Serialize, Debug)]
pub struct UserData {
    pub user: UserResponse,
}

#[derive(Serialize, Debug)]
pub struct UserDataResponse {
    pub status: String,
    pub data: UserData,
}
