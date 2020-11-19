package com.coco.back.models;

import com.coco.back.deserializers.CustomInstantDeserializer;
import com.coco.back.enums.SettingEnum;
import com.coco.back.serializers.CustomInstantSerializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import io.quarkus.runtime.annotations.RegisterForReflection;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.time.Instant;

@Entity
@RegisterForReflection
@Table(name = "com_setting")
public class Setting extends PanacheEntityBase {
    @Id
    @Enumerated(EnumType.STRING)
    public SettingEnum id;
    public String value;

    @CreationTimestamp
    @JsonSerialize(using = CustomInstantSerializer.class)
    @JsonDeserialize(using = CustomInstantDeserializer.class)
    public Instant createdAt;

    @UpdateTimestamp
    @JsonSerialize(using = CustomInstantSerializer.class)
    @JsonDeserialize(using = CustomInstantDeserializer.class)
    public Instant updatedAt;

    @Version
    public Integer version;

    @ManyToOne
    @JoinColumn(name = "company_id")
    public Company company;
}
