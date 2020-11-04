package com.dorianmaliszewski.back.models;

import com.dorianmaliszewski.back.deserializers.CustomLocalDateTimeDeserializer;
import com.dorianmaliszewski.back.enums.SettingEnum;
import com.dorianmaliszewski.back.serializers.CustomLocalDateTimeSerializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import io.quarkus.runtime.annotations.RegisterForReflection;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@RegisterForReflection
@Table(name = "com_setting")
public class Setting extends PanacheEntityBase {
    @Id
    @Enumerated(EnumType.STRING)
    public SettingEnum id;
    public String value;

    @CreationTimestamp
    @JsonSerialize(using = CustomLocalDateTimeSerializer.class)
    @JsonDeserialize(using = CustomLocalDateTimeDeserializer.class)
    public LocalDateTime createdAt;

    @UpdateTimestamp
    @JsonSerialize(using = CustomLocalDateTimeSerializer.class)
    @JsonDeserialize(using = CustomLocalDateTimeDeserializer.class)
    public LocalDateTime updatedAt;

    @Version
    public Integer version;

    @ManyToOne
    @JoinColumn(name = "company_id")
    public Company company;
}
